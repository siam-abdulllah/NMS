using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.DashboardDtos
{
    public class AdminDashboardDto
    {
        public double PendingProformaApproval { get; set; }
        public int TotalProforma { get; set; }
        public int ApprovedProforma { get; set; }
        public int PartialApprovedProforma { get; set; }
        public int RejectedProforma{ get; set; }
        public int TotalImporter { get; set; }
        public int TotalEmployee { get; set; }
    }
}
