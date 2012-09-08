使用此命令压缩所有JavaScript文件：

    java -jar ../compiler.jar \
        --js wind-core.js \
        --js wind-builderbase.js \
        --js wind-async.js \
        --js sorting-animations.js \
        --js_output_file all.min.js
        
同时生成SourceMap文件：

    java -jar ../compiler.jar \
        --js wind-core.js \
        --js wind-builderbase.js \
        --js wind-async.js \
        --js sorting-animations.js \
        --js_output_file all.min.js \
        --create_source_map all.min.js.map \
        --source_map_format=V3

并在最后一行加上：

    //@ sourceMappingURL=all.min.js.map