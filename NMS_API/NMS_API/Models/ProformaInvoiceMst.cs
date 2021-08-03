using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Models
{
    public class ProformaInvoiceMst
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
        public string PiScan { get; set; }
        public string LitScan { get; set; }
        public string TestReport { get; set; }
        public string OtherDoc { get; set; }
        public bool Confirmation { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public bool? ApprovalStatus { get; set; }
        public int ImporterId { get; set; }
        [ForeignKey("ImporterId")]
        public ImporterInfo ImporterInfo { get; set; }
        [ForeignKey("MstId")]
        public virtual IEnumerable<ProformaInvoiceDtl> ProformaInvoiceDtls { get; set; }

    }
}
