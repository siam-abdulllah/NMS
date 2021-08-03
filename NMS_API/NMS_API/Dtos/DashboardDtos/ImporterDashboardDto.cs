using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.DashboardDtos
{
    public class ImporterDashboardDto
    {
        public double PendingProformaApproval {get;set;}
        public int TotalProforma { get;set;}
        public int ApprovedProforma { get;set;}
        public int RejectedProduct { get;set;}
    }
}