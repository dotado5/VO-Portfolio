import '@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';

type ProjectPayload = {
  title: string;
  background_story: string;
  role: string;
  skills: string[];
  problem: string;
  strategy: string;
  takeaway: string;
  images: string[];
  delivery_date: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error(
    'SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must be set.',
  );
}

const createPublicClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

const createServiceClient = () =>
  createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

const getRoutePath = (pathname: string) => {
  const match = pathname.match(/\/vo-portfolio-api(?:\/(.*))?$/);
  const route = match?.[1] ?? '';
  return route.replace(/^\/+|\/+$/g, '');
};

const getBearerToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice('Bearer '.length).trim();
};

const parseJsonBody = async <T>(req: Request): Promise<T> => {
  const contentLength = req.headers.get('content-length');
  if (contentLength === '0') {
    return {} as T;
  }

  return await req.json();
};

const requireUser = async (req: Request) => {
  const token = getBearerToken(req);
  if (!token) {
    return { error: jsonResponse({ message: 'No token provided' }, 401) };
  }

  const { data, error } = await createServiceClient().auth.getUser(token);
  if (error || !data.user) {
    return { error: jsonResponse({ message: 'Invalid token' }, 401) };
  }

  return { token, user: data.user };
};

const normalizeProjectPayload = (payload: Partial<ProjectPayload>) => ({
  ...payload,
  delivery_date: payload.delivery_date
    ? new Date(payload.delivery_date).toISOString()
    : undefined,
});

const handleRequest = async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const routePath = getRoutePath(url.pathname);
  const [resource, id] = routePath.split('/');

  try {
    if (resource === 'auth' && req.method === 'POST' && id === 'signup') {
      const body = await parseJsonBody<{ email?: string; password?: string }>(
        req,
      );

      if (!body.email || !body.password) {
        return jsonResponse(
          { message: 'email and password are required' },
          400,
        );
      }

      const publicClient = createPublicClient();
      const serviceClient = createServiceClient();
      const { data, error } = await publicClient.auth.signUp({
        email: body.email,
        password: body.password,
      });

      if (error) {
        return jsonResponse({ message: error.message }, 409);
      }

      if (data.user) {
        const { error: dbError } = await serviceClient.from('users').upsert({
          id: data.user.id,
          email: body.email,
          createdAt: new Date().toISOString(),
        });

        if (dbError) {
          return jsonResponse({ message: dbError.message }, 500);
        }
      }

      return jsonResponse({ user: data.user, session: data.session }, 201);
    }

    if (resource === 'auth' && req.method === 'POST' && id === 'signin') {
      const body = await parseJsonBody<{ email?: string; password?: string }>(
        req,
      );

      if (!body.email || !body.password) {
        return jsonResponse(
          { message: 'email and password are required' },
          400,
        );
      }

      const { data, error } =
        await createPublicClient().auth.signInWithPassword({
          email: body.email,
          password: body.password,
        });

      if (error) {
        return jsonResponse({ message: error.message }, 401);
      }

      return jsonResponse({ user: data.user, session: data.session });
    }

    if (resource === 'auth' && req.method === 'POST' && id === 'signout') {
      const auth = await requireUser(req);
      if ('error' in auth) {
        return auth.error;
      }

      return jsonResponse({ message: 'Signed out successfully' });
    }

    if (resource === 'auth' && req.method === 'GET' && id === 'me') {
      const auth = await requireUser(req);
      if ('error' in auth) {
        return auth.error;
      }

      return jsonResponse(auth.user);
    }

    if (resource === 'projects' && req.method === 'GET' && !id) {
      const { data, error } = await createServiceClient()
        .from('Project')
        .select('*')
        .order('delivery_date', { ascending: false });

      if (error) {
        return jsonResponse({ message: error.message }, 500);
      }

      return jsonResponse(data ?? []);
    }

    if (resource === 'projects' && req.method === 'GET' && id) {
      const projectId = Number(id);
      if (!Number.isInteger(projectId)) {
        return jsonResponse({ message: 'Invalid project id' }, 400);
      }

      const { data, error } = await createServiceClient()
        .from('Project')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (error) {
        return jsonResponse({ message: error.message }, 500);
      }

      if (!data) {
        return jsonResponse(
          { message: `Project with ID ${projectId} not found` },
          404,
        );
      }

      return jsonResponse(data);
    }

    if (resource === 'projects' && req.method === 'POST' && !id) {
      const auth = await requireUser(req);
      if ('error' in auth) {
        return auth.error;
      }

      const body = await parseJsonBody<ProjectPayload>(req);
      const payload = normalizeProjectPayload(body);
      const { data, error } = await createServiceClient()
        .from('Project')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return jsonResponse({ message: error.message }, 400);
      }

      return jsonResponse(data, 201);
    }

    if (resource === 'projects' && req.method === 'PATCH' && id) {
      const auth = await requireUser(req);
      if ('error' in auth) {
        return auth.error;
      }

      const projectId = Number(id);
      if (!Number.isInteger(projectId)) {
        return jsonResponse({ message: 'Invalid project id' }, 400);
      }

      const body = await parseJsonBody<Partial<ProjectPayload>>(req);
      const payload = normalizeProjectPayload(body);
      const { data, error } = await createServiceClient()
        .from('Project')
        .update(payload)
        .eq('id', projectId)
        .select()
        .maybeSingle();

      if (error) {
        return jsonResponse({ message: error.message }, 400);
      }

      if (!data) {
        return jsonResponse(
          { message: `Project with ID ${projectId} not found` },
          404,
        );
      }

      return jsonResponse(data);
    }

    if (resource === 'projects' && req.method === 'DELETE' && id) {
      const auth = await requireUser(req);
      if ('error' in auth) {
        return auth.error;
      }

      const projectId = Number(id);
      if (!Number.isInteger(projectId)) {
        return jsonResponse({ message: 'Invalid project id' }, 400);
      }

      const { data, error } = await createServiceClient()
        .from('Project')
        .delete()
        .eq('id', projectId)
        .select()
        .maybeSingle();

      if (error) {
        return jsonResponse({ message: error.message }, 400);
      }

      if (!data) {
        return jsonResponse(
          { message: `Project with ID ${projectId} not found` },
          404,
        );
      }

      return jsonResponse(data);
    }

    return jsonResponse({ message: 'Not Found' }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return jsonResponse({ message }, 500);
  }
};

Deno.serve(async (req) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vo-portfolio-virid.vercel.app',
  ];

  const reqOrigin = req.headers.get('origin');
  const origin =
    reqOrigin && allowedOrigins.includes(reqOrigin)
      ? reqOrigin
      : allowedOrigins[0];

  const res = await handleRequest(req);
  res.headers.set('Access-Control-Allow-Origin', origin);

  return res;
});
