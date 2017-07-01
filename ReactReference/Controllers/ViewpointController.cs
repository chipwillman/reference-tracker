using System;
using System.Web.Mvc;
using System.Web.UI;
using RechData;
using RechData.Models;

namespace ReactReference.Controllers
{
    public class ViewpointController : Controller
    {
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