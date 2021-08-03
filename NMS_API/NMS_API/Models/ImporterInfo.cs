using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Models
{
    public class ImporterInfo : Entity<int>
    {
        public string OrgName { get; set; }
        public string ContactName { get; set; }
        public string Position { get; set; }
        public string ContactNo { get; set; }
        public string Email { get; set; }
        public string Division { get; set; }
        public string District { get; set; }
        public string Upazila { get; set; }
        public string Address { get; set; }
        public string DlsLicenseType { get; set; }
        public string DlsLicenseNo { get; set; }
        public string DlsLicenseScan { get; set; }
        public string NidNo { get; set; }
        public string NidScan { get; set; }
        public string IrcScan { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public UserLogin UserLogin { get; set; }
        public string ImpCode { get; set; }
    }
}