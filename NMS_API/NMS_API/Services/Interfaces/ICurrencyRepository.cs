﻿using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface ICurrencyRepository
    {
        Task<IEnumerable<CurrencyRate>> Get();
    }
}