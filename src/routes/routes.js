const express = require("express");
const router = express.Router();
const healthRoute = require("./health/healthRoute");
const authRoute = require("./user/userRoute");
const defaultRoutes = [
  {
    path: "/check",
    route: healthRoute,
  },
  {
    path: "/user",
    route: authRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
