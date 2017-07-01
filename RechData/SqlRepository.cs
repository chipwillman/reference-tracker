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

        public Hypothesis[] GetHypotheses(int skip, int count)
        {
            Hypothesis[] results;
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                results = connection.Query<Hypothesis>(string.Format(@"
SELECT TOP {0} 
    HypothesisID,
    RTRIM(Name) as Name,
    Description
FROM Hypothesis
ORDER BY Name
", count)).ToArray();
            }
            return results.ToArray();
        }

        public bool AddHypothesis(Hypothesis faction)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "INSERT INTO Hypothesis(HypothesisID, Name, Description, FactionID) VALUES(@HypothesisId, @Name, @Description, @FactionId);";

                var rowsAffected = connection.Query<int>(sql, faction).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool DeleteHypothesis(Hypothesis faction)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "DELETE FROM Hypothesis WHERE HypothesisID = @HypothesisId;";

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
    Evidence.ViewpointId,
    Evidence.FactionId,
    Evidence.ReferenceId,
    Evidence.Importance,
    Evidence.Statement
FROM Evidence 
WHERE Evidence.ViewPointID = @pk

SELECT 
    Reference.ReferenceId,
    RTRIM(Reference.Name) as Name,
    RTRIM(Reference.Cite) as Cite,
    RTRIM(Reference.Type) as Type,
    Reference.Confidence,
    Reference.ParentReferenceId
FROM Reference 
JOIN Evidence ON Evidence.ReferenceId = Reference.ReferenceId
WHERE Evidence.ViewPointID = @pk
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

        public Hypothesis GetHypothesis(Guid pk)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql = @"
SELECT 
    HypothesisID,
    RTRIM(Name) as Name,
    Description,
    FactionId
FROM Hypothesis WHERE ViewPointID = @pk;

SELECT 
    HypothesisEvidence.HypothesisEvidenceId,
    Evidence.EvidenceId,
    RTRIM(Evidence.Name) as Name,
    RTRIM(Evidence.Status) as Status,
    HypothesisEvidence.HypothesisId,
    Evidence.ViewpointId,
    Evidence.ReferenceId,
    Evidence.Importance,
    Evidence.Statement as EvidenceStatement,
    HypothesisEvidence.Statement as HypothesisStatement
FROM Evidence 
JOIN HypothesisEvidence ON HypothesisEvidence.EvidenceId = Evidence.EvidenceId
WHERE HypothesisEvidence.HypothesisID = @pk

SELECT 
    Reference.ReferenceId,
    RTRIM(Reference.Name) as Name,
    RTRIM(Reference.Cite) as Cite,
    RTRIM(Reference.Type) as Type,
    Reference.Confidence,
    Reference.ParentReferenceId
FROM Reference 
JOIN Evidence ON Evidence.ReferenceId = Reference.ReferenceId
JOIN HypothesisEvidence ON HypothesisEvidence.EvidenceId = Evidence.EvidenceId
WHERE HypothesisEvidence.HypothesisID = @pk
";
                var gridReader = connection.QueryMultiple(sql, new { pk = pk });
                var result = gridReader.Read<Hypothesis>().FirstOrDefault();
                if (result != null)
                {
                    result.Evidence = gridReader.Read<HypothesisEvidence>().ToArray();
                    result.References = gridReader.Read<Reference>().ToArray();
                }
                return result;
            }
        }

        public Reference[] GetReferences(int skip, int count)
        {
            Reference[] results;
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                results = connection.Query<Reference>(string.Format(@"
SELECT TOP {0} 
    Reference.ReferenceId,
    RTRIM(Reference.Name) as Name,
    RTRIM(Reference.Cite) as Cite,
    RTRIM(Reference.Type) as Type,
    Reference.Confidence,
    Reference.ParentReferenceId
FROM Reference
ORDER BY Name
", count)).ToArray();
            }
            return results.ToArray();
        }
        public Reference GetReference(Guid pk)
        {
            Reference result;
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                result = connection.Query<Reference>(@"
SELECT 
    Reference.ReferenceId,
    RTRIM(Reference.Name) as Name,
    RTRIM(Reference.Cite) as Cite,
    RTRIM(Reference.Type) as Type,
    Reference.Confidence,
    Reference.ParentReferenceId
FROM Reference
WHERE
    ReferenceId = @pk
ORDER BY Name
", new { pk = pk }).SingleOrDefault();
            }
            return result;
        }

        public bool AddReference(Reference reference)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql = @"
INSERT INTO Reference
(ReferenceID, Name, Cite, Type, Confidence, ParentReferenceId) 
VALUES
(@ReferenceId, @Name, @Cite, @Type, @Confidence, @ParentReferenceId);
";

                var rowsAffected = connection.Query<int>(sql, reference).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool DeleteReference(Reference reference)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "DELETE FROM Reference WHERE ReferenceID = @ReferenceId;";

                var rowsAffected = connection.Query<int>(sql, reference).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }


        public Evidence[] GetEvidence(int skip, int count)
        {
            Evidence[] results;
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                results = connection.Query<Evidence>(string.Format(@"
SELECT TOP {0} 
    Evidence.EvidenceId,
    RTRIM(Evidence.Name) as Name,
    RTRIM(Evidence.Cite) as Cite,
    RTRIM(Evidence.Type) as Type,
    Evidence.Confidence,
    Evidence.ParentEvidenceId
FROM Evidence
ORDER BY Name
", count)).ToArray();
            }
            return results.ToArray();
        }
        public Evidence GetEvidence(Guid pk)
        {
            Evidence result;
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                result = connection.Query<Evidence>(@"
SELECT 
    Evidence.EvidenceId,
    RTRIM(Evidence.Name) as Name,
    RTRIM(Evidence.Cite) as Cite,
    RTRIM(Evidence.Type) as Type,
    Evidence.Confidence,
    Evidence.ParentEvidenceId
FROM Evidence
WHERE
    EvidenceId = @pk
ORDER BY Name
", new { pk = pk }).SingleOrDefault();
            }
            return result;
        }

        public bool AddEvidence(Evidence evidence)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql = @"
INSERT INTO Evidence
(EvidenceID, Name, Status, ViewpointId, FactionId, ReferenceId, Importance, Statement) 
VALUES
(@EvidenceId, @Name, @Status, @ViewpointId, @FactionId, @ReferenceId, @Importance, @Statement);
";

                var rowsAffected = connection.Query<int>(sql, evidence).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool DeleteEvidence(Evidence evidence)
        {
            using (var connection = new SqlConnection(System.Configuration.ConfigurationManager
                .ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql =
                    "DELETE FROM Evidence WHERE EvidenceID = @EvidenceId;";

                var rowsAffected = connection.Query<int>(sql, evidence).SingleOrDefault();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            return false;
        }

    }
}