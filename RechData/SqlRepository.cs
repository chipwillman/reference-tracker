using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using RechData.Models;

namespace RechData
{
    public class SqlRepository
    {
        public Faction[] GetFactions(int skip, int count)
        {
            Faction[] results;
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                results = connection.Query<Faction>(string.Format(@"
SELECT TOP {0} 
    FactionID,
    RTRIM(Name) as Name,
    Description
FROM Faction
ORDER BY Name
", count)).ToArray();
            }
            return results.ToArray();
        }

        public bool AddFaction(Faction faction)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "INSERT INTO Faction(FactionID, Name, Description) VALUES(@FactionId, @Name, @Description);";

                var rowsAffected = connection.Query<int>(sql, faction).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool DeleteFaction(Faction faction)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "DELETE FROM Faction WHERE FactionID = @FactionId;";

                var rowsAffected = connection.Query<int>(sql, faction).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public ViewPoint[] GetViewpoints(int skip, int count)
        {
            ViewPoint[] results;
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                results = connection.Query<ViewPoint>(string.Format(@"
SELECT TOP {0} 
    ViewPointID,
    RTRIM(Name) as Name,
    BeginDate,
    EndDate,
    Description
FROM ViewPoint
ORDER BY Name
", count)).ToArray();
            }
            return results.ToArray();
        }

        public bool AddViewPoint(ViewPoint viewPoint)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "INSERT INTO ViewPoint(ViewPointID, Name, BeginDate, EndDate, Description) VALUES(@ViewPointID, @Name, @BeginDate, @EndDate, @Description);";

                var rowsAffected = connection.Query<int>(sql, viewPoint).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool DeleteViewPoint(ViewPoint viewPoint)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "DELETE FROM ViewPoint WHERE ViewPointID = @ViewPointId;";

                var rowsAffected = connection.Query<int>(sql, viewPoint).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public ViewPoint GetViewpoint(Guid pk)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql = @"
SELECT 
    ViewPointID,
    RTRIM(Name) as Name,
    BeginDate,
    EndDate,
    Description
FROM ViewPoint WHERE ViewPointID = @pk;

SELECT 
    Evidence.EvidenceId,
    RTRIM(Evidence.Name) as Name,
    RTRIM(Evidence.Status) as Status,
    Evidence.HypothesisId,
    Evidence.FactionId,
    Evidence.ReferenceId,
    Evidence.Importance
FROM Evidence 
JOIN ViewPointEvidence ON ViewPointEvidence.EvidenceId = Evidence.EvidenceId
WHERE ViewPointEvidence.ViewPointID = @pk

SELECT 
    Reference.ReferenceId,
    RTRIM(Reference.Name) as Name,
    RTRIM(Reference.Cite) as Cite,
    RTRIM(Reference.Type) as Type,
    Reference.Confidence,
    Reference.ParentReferenceId
FROM Reference 
JOIN Evidence ON Evidence.ReferenceId = Reference.ReferenceId
JOIN ViewPointEvidence ON ViewPointEvidence.EvidenceId = Evidence.EvidenceId
WHERE ViewPointEvidence.ViewPointID = @pk
";
                var gridReader = connection.QueryMultiple(sql, new { pk = pk});
                var result = gridReader.Read<ViewPoint>().FirstOrDefault();
                if (result != null)
                {
                    result.Evidence = gridReader.Read<Evidence>().ToArray();
                    result.References = gridReader.Read<Reference>().ToArray();
                }
                return result;
            }
        }
    }
}