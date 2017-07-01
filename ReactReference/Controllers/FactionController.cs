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
    public class FactionController : Controller
    {
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
    }
}