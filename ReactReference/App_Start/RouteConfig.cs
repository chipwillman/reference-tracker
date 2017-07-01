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
                defaults: new { controller = "Faction", action = "AddFaction" }
            );

            routes.MapRoute(
                name: "DeleteFaction",
                url: "factions/delete",
                defaults: new { controller = "Faction", action = "DeleteFaction" }
            );

            routes.MapRoute(
                name: "Factions",
                url: "factions",
                defaults: new { controller = "Faction", action = "Factions" }
            );

            routes.MapRoute(
                name: "AddHypothesis",
                url: "hypotheses/new",
                defaults: new { controller = "Hypothesis", action = "AddHypothesis" }
            );

            routes.MapRoute(
                name: "DeleteHypothesis",
                url: "hypotheses/delete",
                defaults: new { controller = "Hypothesis", action = "DeleteHypothesis" }
            );

            routes.MapRoute(
                name: "Hypotheses",
                url: "hypotheses",
                defaults: new { controller = "Hypothesis", action = "Hypotheses" }
            );

            routes.MapRoute(
                name: "SingleHypothesis",
                url: "hypotheses/{hypothesisId}",
                defaults: new { controller = "Hypothesis", action = "Hypothesis" }
            );

            routes.MapRoute(
                name: "AddReference",
                url: "references/new",
                defaults: new { controller = "Reference", action = "AddReference" }
            );

            routes.MapRoute(
                name: "DeleteReference",
                url: "references/delete",
                defaults: new { controller = "Reference", action = "DeleteReference" }
            );

            routes.MapRoute(
                name: "References",
                url: "references",
                defaults: new { controller = "Reference", action = "References" }
            );

            routes.MapRoute(
                name: "SingleReferences",
                url: "references/{hypothesisId}",
                defaults: new { controller = "Reference", action = "Reference" }
            );

            routes.MapRoute(
                name: "AddViewpoint",
                url: "viewpoints/new",
                defaults: new { controller = "Viewpoint", action = "AddViewpoint" }
            );

            routes.MapRoute(
                name: "DeleteViewpoint",
                url: "viewpoints/delete",
                defaults: new { controller = "Viewpoint", action = "DeleteViewpoint" }
            );

            routes.MapRoute(
                name: "ViewpointDetails",
                url: "viewpoints/{viewpointId}",
                defaults: new { controller = "Viewpoint", action = "Viewpoint" }
            );

            routes.MapRoute(
                name: "Viewpoints",
                url: "viewpoints",
                defaults: new { controller = "Viewpoint", action = "Viewpoints" }
            );

            routes.MapRoute(
                name: "AddEvidence",
                url: "evidence/new",
                defaults: new { controller = "Evidence", action = "AddEvidence" }
            );

            routes.MapRoute(
                name: "DeleteEvidence",
                url: "evidence/delete",
                defaults: new { controller = "Evidence", action = "DeleteEvidence" }
            );

            routes.MapRoute(
                name: "EvidenceDetails",
                url: "evidence/{evidenceId}",
                defaults: new { controller = "Evidence", action = "Evidence" }
            );

            routes.MapRoute(
                name: "Evidences",
                url: "evidence",
                defaults: new { controller = "Evidence", action = "Evidences" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
