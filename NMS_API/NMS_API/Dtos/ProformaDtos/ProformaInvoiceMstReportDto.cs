using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaDtos
{
    public class ProformaInvoiceMstReportDto
    {
        public int Id { get; set; }
        public string ApplicationNo { get; set; }
        public string ProformaInvoiceNo { get; set; }
        public DateTime ProformaDate { get; set; }
        public DateTime? SubmissionDate { get; set; }
        public string CountryOfOrigin { get; set; }
        public string Currency { get; set; }
        public string PortOfLoading { get; set; }
        public string PortOfEntry { get; set; }   
        public bool Confirmation { get; set; }
        public int ImporterId { get; set; }
        public string OrgName { get; set; }
        public string Address { get; set; }
    }
}
