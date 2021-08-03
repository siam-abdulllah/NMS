using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Models
{
    public class ProformaInvoiceDtl
    {
        public int Id { get; set; }
        public int MstId { get; set; }
        public string ProdName { get; set; }
        public string ProdType { get; set; }
        public string HsCode { get; set; }
        public string Manufacturer { get; set; }
        public string PackSize { get; set; }
        public int NoOfUnits { get; set; }
        public double UnitPrice { get; set; }
        public double TotalAmount { get; set; }
        public double ExchangeRate { get; set; }
        public double TotalPrice { get; set; }
        public double TotalPriceInBdt { get; set; }
        public bool? ApprovalStatus { get; set; }
        public int ApprovedBy { get; set; }
        public string Remarks { get; set; }
        public double? ApprovedAmount { get; set; }
    }
}
