using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos
{
    public class ImporterForProformaDto
    {
        public int ImporterId { get; set; }
    }
    public class RemainingAmountforPIProductDto
    {
        public int ImporterId { get; set; }
        public string ProdName { get; set; }
        public string PackSize { get; set; }
        public string HsCode { get; set; }
    }
}
