using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace RechData.Tests
{
    [TestClass]
    public class TestSqlRepository
    {
        [TestMethod]
        public void TestGetFactions()
        {
            var repo = new SqlRepository();
            var factions = repo.GetFactions(0, 100);
            Assert.IsTrue(factions.Length > 0);
        }
    }
}
