using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.CurrencyRateDtos
{
    public class CreateCurrencyDto :Entity<int?>
    {
        [Required]
        [StringLength(128, MinimumLength = 1)]
        public string Currency { get; set; }
        public string TickerIcon { get; set; }
        public double ExchangeRate { get; set; }
        public int? CreatorUserId { get; set; }
        public DateTime? CreationTime { get; set; }
        public int? LastModifierUserId { get; set; }
        public DateTime? LastModificationTime { get; set; }
        public virtual bool IsDeleted { get; set; }
        public virtual long? DeleterUserId { get; set; }
        public virtual DateTime? DeletionTime { get; set; }
    }
}
