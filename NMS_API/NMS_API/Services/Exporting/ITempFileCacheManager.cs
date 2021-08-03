using Abp.Dependency;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Exporting
{
    public interface ITempFileCacheManager : ITransientDependency
    {
        void SetFile(string token, byte[] content);

        byte[] GetFile(string token);
    }
}
