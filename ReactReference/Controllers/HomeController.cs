using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using RechData;
using RechData.Models;

namespace ReactReference.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Factions()
        {
            return Json(new SqlRepository().GetFactions(0, 100), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddFaction(Faction faction)
        {
            faction.FactionId = Guid.NewGuid();
            new SqlRepository().AddFaction(faction);
            return Content("Faction added");
        }

        [HttpPost]
        public ActionResult DeleteFaction(Faction faction)
        {
            new SqlRepository().DeleteFaction(faction);
            return Content("Faction Deleted");
        }

        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Viewpoints()
        {
            return Json(new SqlRepository().GetViewpoints(0, 100), JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Viewpoint(string viewpointId)
        {
            Guid pk = Guid.Parse(viewpointId);
            return Json(new SqlRepository().GetViewpoint(pk), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddViewpoint(ViewPoint viewPoint)
        {
            viewPoint.ViewPointId = Guid.NewGuid();
            new SqlRepository().AddViewPoint(viewPoint);
            return Content("Viewpoint added");
        }

        [HttpPost]
        public ActionResult DeleteViewpoint(ViewPoint viewPoint)
        {
            new SqlRepository().DeleteViewPoint(viewPoint);
            return Content("Viewpoint Deleted");
        }
    }
}