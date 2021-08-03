using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Common
{
    public class NumberGenerator
    {
        public string GenerateAnnualReqNo(int totalAnnualReq, int numLength)
        {
            var totalReq = totalAnnualReq.ToString();
            var len = totalReq.Length;
            var zeroLength = numLength - len;
            var zeros = GenerateZero(zeroLength);
            //var newAnnReqNo = (totalAnnualReq + 1).ToString();
            return zeros + totalReq;
        }
        public string GenerateProformaInvNo(int totalProformaInv, int numLength)
        {
            var totalProforma = totalProformaInv.ToString();
            var len = totalProforma.Length;
            var zeroLength = numLength - len;
            var zeros = GenerateZero(zeroLength);
            var newProformaInv = totalProformaInv.ToString();
            return zeros + newProformaInv;
        }
        private string GenerateZero(int zeroLength)
        {
            string precZero = "";
            while (zeroLength > 0)
            {
                precZero += "0";
                zeroLength--;
            }
            return precZero;
        }
    }
}
