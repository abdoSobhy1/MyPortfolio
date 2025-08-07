import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to get the real client IP from various headers
    // These headers are commonly used by proxies, load balancers, and CDNs
    const clientIP = 
      req.headers.get('CF-Connecting-IP') ||  // Cloudflare
      req.headers.get('X-Real-IP') ||         // Nginx proxy
      req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || // Load balancers
      req.headers.get('X-Client-IP') ||       // Apache
      req.headers.get('X-Cluster-Client-IP') || // Cluster
      'unknown';

    console.log('Client IP detected:', clientIP);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    return new Response(JSON.stringify({ ip: clientIP }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-client-ip function:', error);
    return new Response(JSON.stringify({ error: error.message, ip: 'unknown' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});