using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaApprovalDtos
{
    public class ProformaApprovalDateRangeDto
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public bool IsPending { get; set; }
    }
}
