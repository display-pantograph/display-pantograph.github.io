for file in `ls -tU`; do
    if [[ $file =~ .*\.(png|jpeg|jpg) ]]; then 
        for file2 in `ls -tU`; do
            if [[ $file2 =~ .*\.(txt|rtf) && "${file%.*}" == "${file2%.*}" ]]; then
                echo "---\nimg: assets/${file}\ntxt: `cat ${file2}`\n---" > ../posts/${file%.*}.md
                echo "Bingo"
                break
            else
                echo "---\nimg: assets/${file}\n---" > ../posts/${file%.*}.md
            fi
        done
    elif [[ $file =~ .*\.(mp4) ]]; then 
        echo "---\nvid: assets/${file}\n---" > ../posts/${file%.*}.md
    else
        echo $file "is neither video nor image, posts not written"
    fi
done
