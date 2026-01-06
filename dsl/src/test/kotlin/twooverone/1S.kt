package twooverone

import com.github.phisgr.bridge.BiddingTree

/**
 * 1S 開叫及應叫
 * 5+S，12-21 HCP
 */
fun BiddingTree.oneSpade() {
    explanation = "5張以上S排組，12-21點"

    // 迫叫性1NT
    "1N" - "迫叫性無將：5-12點，非配合" {
        forcingNoTrumpAfterSpade()
    }

    // 簡單加叫
    "2S" - "簡單加叫：5-9點，3-4張S支持" {
        simpleRaiseSpade()
    }

    // 二蓋一應叫（迫叫進局）
    "2C" - "二蓋一：4+C，12+點，迫叫進局" {
        twoOverOneAfterSpade()
    }
    "2D" - "二蓋一：4+D，12+點，迫叫進局" {
        twoOverOneAfterSpade()
    }
    "2H" - "二蓋一：5+H，12+點，迫叫進局" {
        twoOverOneAfterSpade()
    }

    // 有限加叫（跳加叫）
    "3S" - "有限加叫：9-12點，3張支持+短排組或4張支持無短排組" {
        limitRaiseSpade()
    }

    // 施賴伯迫叫進局跳叫
    "3H" - "施賴伯跳叫：9-12點，4-5張S支持+單缺張，迫叫進局" {
        schreiberJumpSpade()
    }

    // 迫叫性加叫（蹦跳叫牌）
    "3N" - "蹦跳叫牌：12-15點，4-5張S支持+H短排組"
    "4C" - "瑞士式：12-15點，4-5張S支持+好將牌(含2頂張)" {
        swissAfterSpade()
    }
    "4D" - "瑞士式：12-15點，4-5張S支持+差將牌" {
        swissAfterSpade()
    }
    "4H" - "蹦跳叫牌：12-15點，4-5張S支持+H短排組"

    // 直接進局
    "4S" - "止叫進局"

    // 干擾後的叫牌
    overcall("2any") {
        supportDoubleSpade()
    }
}

/**
 * 1S後迫叫性1NT的開叫者再叫
 */
private fun BiddingTree.forcingNoTrumpAfterSpade() {
    "2C" - "4+C或3C（5-3-3-2低限時），可能5S-5C" {
        "Pass" - "5+C弱牌"
        "2D" - "5+D，5-9點"
        "2H" - "5+H，5-9點"
        "2S" - "2張S支持，5-9點"
        "2N" - "邀叫"
        "3C" - "好的6+C，邀叫"
        "3D" - "好的6+D，邀叫"
        "3H" - "好的6+H，邀叫"
        "3S" - "延遲性有限加叫：9-12點，3張S"
    }

    "2D" - "4+D" {
        "Pass" - "5+D弱牌"
        "2H" - "5+H"
        "2S" - "2張S支持，5-9點"
        "2N" - "邀叫"
        "3S" - "延遲性有限加叫"
    }

    "2H" - "4+H" {
        "Pass" - "5+H弱牌"
        "2S" - "2張S支持，5-9點"
        "2N" - "邀叫"
        "3H" - "4張H支持，邀叫"
        "3S" - "延遲性有限加叫"
    }

    "2S" - "6+S，12-15點" {
        "Pass" - "弱牌"
        "2N" - "邀叫"
        "3S" - "邀叫"
        "4S" - "止叫"
    }

    "2N" - "18-19點，迫叫一輪"

    "3C" - "跳叫：5+S-4+C，19+點"
    "3D" - "跳叫：5+S-4+D，19+點"
    "3H" - "跳叫：5+S-4+H，19+點"
    "3S" - "6+S，15-19點"

    "4S" - "7+S強排組"
}

/**
 * 簡單加叫後的開叫者再叫
 */
private fun BiddingTree.simpleRaiseSpade() {
    "Pass" - "低限，不進局試探"
    "3C" - "進局試探：C排組有些大牌" {
        "3S" - "C排組弱"
        "4S" - "C排組好"
    }
    "3D" - "進局試探：D排組有些大牌"
    "3H" - "進局試探：H排組有些大牌"
    "3S" - "阻擊性再加叫：6張S"
    "4S" - "進局：19+點或6張S高限"
}

/**
 * 二蓋一應叫後的開叫者再叫
 */
private fun BiddingTree.twoOverOneAfterSpade() {
    "2H" - "4+H"
    "2S" - "6+S，或5S無其他可叫"
    "2N" - "13-15點均衡型"
    "3C" - "3+C支持帶大牌，14-15點"
    "3D" - "3+D支持帶大牌，14-15點"
    "3H" - "3+H支持帶大牌，14-15點"
    "3S" - "好的6+S"
    "3N" - "16-18點均衡型，6張S接近堅實"
    "4C" - "蹦跳叫牌：C短排組"
    "4D" - "蹦跳叫牌：D短排組"
    "4H" - "蹦跳叫牌：H短排組"
}

/**
 * 有限加叫後的開叫者再叫
 */
private fun BiddingTree.limitRaiseSpade() {
    "Pass" - "12-13點均衡型低限"
    "3N" - "馬歇問叫：問短排組" {
        "4C" - "C短排組"
        "4D" - "D短排組"
        "4H" - "H短排組"
        "4S" - "無短排組（半均衡型）"
    }
    "4S" - "接受邀叫"
}

/**
 * 施賴伯迫叫進局跳叫後
 */
private fun BiddingTree.schreiberJumpSpade() {
    "3S" - "問牌（要求說明牌情）" {
        "3N" - "有缺門排組" {
            "4C" - "問缺門所在" {
                "4D" - "D缺門"
                "4H" - "H缺門"
                "4S" - "C缺門"
            }
        }
        "4C" - "C單張"
        "4D" - "D單張"
        "4H" - "H單張"
    }
    "4S" - "止叫（無滿貫興趣）"
}

/**
 * 瑞士式加叫後
 */
private fun BiddingTree.swissAfterSpade() {
    "4S" - "止叫"
    "4N" - "RKC黑木問叫"
}

/**
 * 支持性賭倍
 */
private fun BiddingTree.supportDoubleSpade() {
    remark(opener, "賭倍表示對應叫花色有3張支持")
    remark(opener, "簡單加叫表示4張支持")
}
