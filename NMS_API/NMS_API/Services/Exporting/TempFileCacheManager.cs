using Abp.Runtime.Caching;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NMS_API.Services.Exporting
{
    public class TempFileCacheManager : ITempFileCacheManager
    {

        public void SetFile(string token, byte[] content)
        {
            Token = token;
            Content = content;
        }

        public byte[] GetFile(string token)
        {
            return Encoding.ASCII.GetBytes(token);
        }

        public string Token { get; set; }

        public  byte[] Content { get; set; }
    }
}
