using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace ConferenceManagement
{
    public class ConferenceManagementDbContext : DbContext 
    {
        public ConferenceManagementDbContext() :
            base("Name=ConferenceManagementDataService") { }

      //  public CodeCamperDbContext()
       //     : base(nameOrConnectionString: "CodeCamper") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Use singular table names
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            Database.SetInitializer<ConferenceManagementDbContext>(null);

            modelBuilder.Configurations.Add(new SessionConfiguration());
           
        }

        public DbSet<Session> Sessions { get; set; }
        public DbSet<ConferencePerson> ConferencePersons { get; set; }
      

        // Lookup Lists
        public DbSet<ConferenceRoom> ConferenceRooms { get; set; }
        public DbSet<ConferenceTimeSlot> ConferenceTimeSlots { get; set; }
        public DbSet<ConferenceTrack> ConferenceTracks { get; set; }
        public DbSet<Archaive> Archaives { get; set; }

       
    }
}