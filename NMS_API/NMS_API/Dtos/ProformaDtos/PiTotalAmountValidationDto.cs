using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaDtos
{
    public class PiTotalAmountValidationDto
    {
        public double? AnnualTotalAmount { get; set; }
        public double? ProformaTotalAmount { get; set; }
        public double?   RemainingAmount { get; set; }
        public bool ValidationStatus { get; set; }

    }
}
