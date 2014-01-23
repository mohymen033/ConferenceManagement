using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ConferenceManagement
{
    public class Session
    {
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Title { get; set; }
        [Required]
        public string Code { get; set; }
        public int SpeakerId { get; set; }
        public int ConferenceTrackId { get; set; }
        public int ConferenceTimeSlotId { get; set; }
        public int ConferenceRoomId { get; set; }
        public string Level { get; set; }
        public string Tags { get; set; }
        public string Description { get; set; }
        public int ArchaiveId { get; set; }

        public virtual ConferencePerson Speaker { get; set; }
        public virtual ConferenceTrack ConferenceTrack { get; set; }
        public virtual ConferenceTimeSlot ConferenceTimeSlot { get; set; }
        public virtual ConferenceRoom ConferenceRoom { get; set; }

        public virtual Archaive Archaive { get; set; }
       
    }
}
