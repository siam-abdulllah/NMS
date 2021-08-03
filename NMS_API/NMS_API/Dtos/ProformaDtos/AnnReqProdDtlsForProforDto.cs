using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaDtos
{
    public class AnnReqProdDtlsForProforDto
    {
        public int ProductId { get; set; }
        public string ProdName { get; set; }
        public string ProdType { get; set; }
        public string HsCode { get; set; }
        public string Manufacturer { get; set; }
        public string PackSize { get; set; }
        public string Country { get; set; }
        public int TentativeUnits { get; set; }
        public double TotalAmount { get; set; }
        public double? RemainingAmount { get; set; }
    }
}
