let globalMax = 0;
const mask = new Uint16Array(2500**2);

function checkEdge(l, r, strArray) {
    if(l >= r) return;
    
    let localMax = 0;
    let found = true;
        for(let i=l; i<r/2; i++) {
            if(strArray[i] !== strArray[r+l-i]) {
                found = false;
                break;
            }
        }
    
    if(found) {
        localMax = r - l + 1
        mask[(r << 8) + l] = localMax
    }
    if(localMax > globalMax) {
        globalMax = localMax;
    }
    else {
        if(!mask[(r << 8) + l+1]) {
            checkEdge(l+1, r, strArray);
        }
        if(!mask[((r-1) << 8) + l]) {
            checkEdge(l, r-1, strArray);
        }
    }
}

function solution(s)
{
    const strArray = s.split('')
    checkEdge(0, strArray.length-1, strArray)
    
    return globalMax;
}

console.log(solution("acsxcdadasdeacsxxxbaxxcdadasdeacsxxxbabaaccdadasdeacdadcdadasdeacsxxxbaascdadasdeacdadasdeacsxxxbacsxxxbadeacsxxxbacsxxxbasxxxbacdadasdeaccdadasdeacsxxxbasxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadasdeacsxxxbacdadcdadasdeacsxxxbaasdeacsxxxcdadasdeacsxxxbabacdadasdeacsxxxcdadasdeaccdadasdeacsxxxbasxxxbabacdadcdadasdeacsxxxbacdadasdeacsxxxbaasdeacdadasdeacscdadasdeacsxxxbaxxxbacsxxxbacdadasdecdacsxxxbacdadasdeadasde"))