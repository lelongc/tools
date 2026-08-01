import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import sys

async def main():
    server_params = StdioServerParameters(
        command="colab-mcp",
        args=[]
    )
    print('Starting colab-mcp...')
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            print('Initialized MCP session')
            
            with open('c1.py', 'r', encoding='utf-8') as f:
                content = f.read()
            
            print('Updating cell 2...')
            res = await session.call_tool('update_cell', arguments={'cellId': 'cell_002', 'content': content})
            print('Update result:', res)
            
            print('Running cell 2...')
            res = await session.call_tool('run_code_cell', arguments={'cellId': 'cell_002'})
            print('Run result:', res)

if __name__ == '__main__':
    asyncio.run(main())
