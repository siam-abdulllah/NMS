using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NMS_API.Dtos.DashboardDtos;

namespace NMS_API.Services.Interfaces
{
    public interface IDashboardRepository
    {
        Task<ImporterDashboardDto> GetImporterDashboardInfo(int importerId);
        Task<AdminDashboardDto> GetAdminDashboardInfo();
    }
}
