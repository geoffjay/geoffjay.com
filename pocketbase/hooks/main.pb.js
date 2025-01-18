routerUse((next) => {
  return (c) => {
    // ip:port string (not sure if the below will work on ipv6 addresses)
    const addr = c.request().remoteAddr;
    const ip = addr.substring(0, addr.lastIndexOf(":"));

    if (ip === process.env.ADMIN_IP) {
      console.log("IP check succeeded");
      // throw new ForbiddenError("You are not allowed to access this resource");
    }

    return next(c);
  };
});
