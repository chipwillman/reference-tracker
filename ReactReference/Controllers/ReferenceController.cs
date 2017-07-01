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
    public class ReferenceController : Controller
    {
        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult References()
        {
            return Json(new SqlRepository().GetReferences(0, 100), JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Reference(string viewpointId)
        {
            Guid pk = Guid.Parse(viewpointId);
            return Json(new SqlRepository().GetReference(pk), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddReference(Reference viewPoint)
        {
            viewPoint.ReferenceId = Guid.NewGuid();
            new SqlRepository().AddReference(viewPoint);
            return Json(viewPoint.ReferenceId.ToString());
        }

        [HttpPost]
        public ActionResult DeleteReference(Reference viewPoint)
        {
            new SqlRepository().DeleteReference(viewPoint);
            return Content("Reference Deleted");
        }
    }
}