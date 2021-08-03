using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.AnnualReqDtos
{
    public class AnnualReqByMstAndImpDto
    {
        public int MstId { get; set; }
        public int ImporterId { get; set; }
        public string AnnualReqNo { get; set; }
    }
}