using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace ReactReference
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "AddFaction",
                url: "factions/new",
                defaults: new { controller = "Home", action = "AddFaction" }
            );

            routes.MapRoute(
                name: "DeleteFaction",
                url: "factions/delete",
                defaults: new { controller = "Home", action = "DeleteFaction" }
            );

            routes.MapRoute(
                name: "Factions",
                url: "factions",
                defaults: new { controller = "Home", action = "Factions" }
            );

            routes.MapRoute(
                name: "AddViewpoint",
                url: "viewpoints/new",
                defaults: new { controller = "Home", action = "AddViewpoint" }
            );

            routes.MapRoute(
                name: "DeleteViewpoint",
                url: "viewpoints/delete",
                defaults: new { controller = "Home", action = "DeleteViewpoint" }
            );

            routes.MapRoute(
                name: "ViewpointDetails",
                url: "viewpoints/{viewpointId}",
                defaults: new { controller = "Home", action = "Viewpoint" }
            );

            routes.MapRoute(
                name: "Viewpoints",
                url: "viewpoints",
                defaults: new { controller = "Home", action = "Viewpoints" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
