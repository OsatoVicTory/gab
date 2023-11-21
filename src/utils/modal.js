export const getModalPositions = (ele, width, height, messageByYou, space = 10) => {
    const { innerHeight, innerWidth } = window;
    const { bottom, left, right } = ele.getBoundingClientRect();
    const pos = {};

    function fixHorizontalDim() {
        if(messageByYou) pos.left = Math.max(5, right - width - space) + 'px';
        else pos.right = Math.max(5, innerWidth - left - width - space) + 'px';
    };

    if(bottom + height <= innerHeight - space) {
        pos.bottom = (innerHeight - bottom - height) + 'px';
        fixHorizontalDim();
    } else {
        pos.top = `${Math.max(space, bottom - height - space)}px`;
        fixHorizontalDim();
    }
    return pos;
};

export const getEmojiSkintonesModalPositions = (ele, width) => {
    const { top, right } = ele.getBoundingClientRect();
    const pos = {};
    pos.top = (top - 55) + 'px';
    if(right < width) pos.left = '5px';
    else pos.left = (right - width) + 'px';
    const tick = { left: (right - 10) + 'px', top: (top - 5) + 'px' };
    return { pos, tick };
};