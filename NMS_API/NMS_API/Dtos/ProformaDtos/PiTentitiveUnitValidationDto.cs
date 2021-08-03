using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaDtos
{
    public class PiTentitiveUnitValidationDto
    {
        public double? AnnualTentiveUnit { get; set; }
        public double? ProformaTentiveUnit { get; set; }
        public double? RemainingAmount { get; set; }
        public bool ValidationStatus { get; set; }
    }
}
