using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;

namespace ConferenceManagement.Controllers
{
    [BreezeController]
    public class BreezeController : ApiController
    {
        readonly EFContextProvider<ConferenceManagementDbContext>  _contextProvider =
            new EFContextProvider<ConferenceManagementDbContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        [HttpGet]
        public object Lookups()
        {
            var conferencerooms =  _contextProvider.Context.ConferenceRooms;
            var conferencetracks =  _contextProvider.Context.ConferenceTracks;
            var conferencetimeslots = _contextProvider.Context.ConferenceTimeSlots;
            var archaives=_contextProvider.Context.Archaives;
            return new { conferencerooms, conferencetracks, conferencetimeslots, archaives };
        }

       

        [HttpGet]
        public IQueryable<Session> Sessions()
        {
           
            return _contextProvider.Context.Sessions;
        }
        
        [HttpGet]
        public IQueryable<ConferencePerson> ConferencePersons()
        {
            return _contextProvider.Context.ConferencePersons;
        }
         

        [HttpGet]
        public IQueryable<ConferencePerson> Speaker()
        {
            return _contextProvider.Context.ConferencePersons;
               
        }

        [HttpGet]
        public IQueryable<ConferenceTimeSlot> ConferenceTimeSlots()
        {
            return _contextProvider.Context.ConferenceTimeSlots;
            // .Where(p => p.SpeakerSessions.Any());
        }

   }
}