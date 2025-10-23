const nextConfig = ({
  // Default Next.js config. We deliberately avoid setting appDir here so Next's
  // own detection handles the presence of the `app/` directory and avoids
  // emitting an 'Unrecognized key' warning during build.
}) as unknown as Record<string, unknown>;

export default nextConfig;
