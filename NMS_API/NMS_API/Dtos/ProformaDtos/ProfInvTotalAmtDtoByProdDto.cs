using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaDtos
{
    public class ProfInvTotalAmtDtoByProdDto
    {
        public int ImporterId { get; set; }
        public string ProdName { get; set; }
        public string PackSize { get; set; }
        public double? TotalAmount { get; set; }
        public double? TentitiveUnit { get; set; }
    }
}