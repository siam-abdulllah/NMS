using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaDtos
{
    public class ProformaInvoiceDtlUpdateDto
    {
        public int MstId { get; set; }
        public string ProdName { get; set; }
        public string ProdType { get; set; }
        public string HsCode { get; set; }
        public string Manufacturer { get; set; }
        public string PackSize { get; set; }
        public string NoOfUnits { get; set; }
        public string UnitPrice { get; set; }
        public string TotalPrice { get; set; }
        public string TotalPriceInBdt { get; set; }
        public string ExchangeRate { get; set; }
        public string TotalAmount { get; set; }

    }
}