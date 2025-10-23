const nextConfig = ({
  // Use Pages Router and ignore App Router directory (app/) to avoid route conflicts
  appDir: false,
}) as unknown as Record<string, unknown>;

export default nextConfig;
