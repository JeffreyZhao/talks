安装source-map包：

    npm install source-map

压缩test.js同时生成SourceMap文件：

    java -jar ../compiler.jar \
        --js test.js \
        --js_output_file test.min.js \
        --create_source_map test.min.js.map \
        --source_map_format=V3

解码SourceMap文件：

    node dump-source-map.js