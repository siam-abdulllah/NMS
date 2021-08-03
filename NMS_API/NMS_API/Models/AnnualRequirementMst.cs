using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Models
{
    public class AnnualRequirementMst
    {
        public int Id { get; set; }
        public string AnnualReqNo { get; set; }
        public int ImporterId { get; set; }
        public bool Confirmation { get; set; }
        public int? InsertedBy { get; set; }
        public DateTime? InsertedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? SubmissionDate { get; set; }
        [ForeignKey("AnnReqMstId")]
        public virtual IEnumerable<AnnualRequirementDtl> AnnualRequirementDtls { get; set; }
    }
}
