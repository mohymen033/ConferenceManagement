using System;

namespace ConferenceManagement
{
    public class ConferenceTimeSlot
    {
        public ConferenceTimeSlot()
        {
            IsSessionSlot = true;
        }
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public bool IsSessionSlot { get; set; }

        /// <summary>Duration of session in minutes.</summary>
        public int Duration { get; set; }
    }
}
