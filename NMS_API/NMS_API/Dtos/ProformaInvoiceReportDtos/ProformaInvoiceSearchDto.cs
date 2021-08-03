using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaInvoiceReportDtos
{
    public class ProformaInvoiceSearchDto
    {
        public int ImporterId { get;set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Status { get; set; }
    }
}