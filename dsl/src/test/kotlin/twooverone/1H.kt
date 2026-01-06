package twooverone

import com.github.phisgr.bridge.BiddingTree

/**
 * 1H 開叫及應叫
 * 5+H，12-21 HCP
 */
fun BiddingTree.oneHeart() {
    explanation = "5張以上H牌組，12-21點"

    // 1S 應叫
    "1S" - "4+S，5+點" {
        oneHeartAfterOneSpade()
    }

    // 迫叫性1NT
    "1N" - "迫叫性無將：5-12點，非配合也無1S可叫" {
        forcingNoTrumpAfterHeart()
    }

    // 簡單加叫
    "2H" - "簡單加叫：5-9點，3-4張H支持" {
        simpleRaiseHeart()
    }

    // 二蓋一應叫（迫叫進局）
    "2C" - "二蓋一：4+C，12+點，迫叫進局" {
        twoOverOneAfterHeart()
    }
    "2D" - "二蓋一：4+D，12+點，迫叫進局" {
        twoOverOneAfterHeart()
    }

    // 有限加叫（跳加叫）
    "3H" - "有限加叫：9-12點，3張支持+短牌組或4張支持無短牌組" {
        limitRaiseHeart()
    }

    // Schreiber迫叫進局跳叫
    "3D" - "Schreiber跳叫：9-12點，4-5張H支持+單缺張，迫叫進局" {
        schreiberJumpHeart()
    }

    // 迫叫性加叫（Swiss）
    "3S" - "Splinter跳叫：12-15點，4-5張H支持+S短牌組" {
        splinterAfterHeart()
    }
    "4C" - "Swiss：12-15點，4-5張H支持+好將牌(含2頂張)" {
        swissAfterHeart()
    }
    "4D" - "Swiss：12-15點，4-5張H支持+差將牌" {
        swissAfterHeart()
    }

    // 直接進局
    "4H" - "止叫進局"

    // 干擾後的叫牌
    overcall("1S") {
        "X" - "負性賭倍：4+S"
        "1N" - "7-10點，有S止張"
        "2H" - "簡單加叫"
        "3H" - "有限加叫"
    }

    overcall("2any") {
        supportDouble()
    }
}

/**
 * 1H-1S後的開叫者再叫
 */
private fun BiddingTree.oneHeartAfterOneSpade() {
    "1N" - "低限平均牌型，12-15點，5-3-3-2" {
        // 應叫者再叫
        "2C" - "新低花牌組迫叫"
        "2D" - "新低花牌組迫叫"
        "2H" - "有限加叫：9-12點，3張H支持"
        "2S" - "邀叫：6+S"
        "2N" - "邀叫"
        "3N" - "止叫"
    }

    "2C" - "4+C，可能5H-4C或更長" {
        "2D" - "第四花色牌組迫叫"
        "2H" - "3張H支持，12-15點"
        "2S" - "5+S"
        "2N" - "邀叫"
        "3H" - "3張H支持，15+點滿貫興趣"
    }

    "2D" - "4+D，可能5H-4D或更長" {
        "2H" - "3張H支持，12-15點"
        "2S" - "5+S"
        "2N" - "邀叫"
    }

    "2H" - "6+H，12-15點" {
        "2S" - "5+S"
        "2N" - "邀叫"
        "3H" - "邀叫：3張H支持"
        "4H" - "止叫"
    }

    "2S" - "4S，16+點倒叫" {
        "2N" - "示弱（5-9點）或迫叫，等待進一步信息"
        "3H" - "3張H支持，迫叫"
        "3S" - "4+S支持，迫叫進局"
        "4H" - "止叫"
        "4S" - "止叫"
    }

    "2N" - "18-19點平均牌型，迫叫一輪"

    "3C" - "跳叫新花色：5+H-4+C，19+點迫叫進局"
    "3D" - "跳叫新花色：5+H-4+D，19+點迫叫進局"

    "3H" - "6+H，15-19點跳再叫"

    "3S" - "4S，19+點跳加叫"

    "3N" - "16-18點，6張堅實H牌組"

    "4C" - "Splinter跳叫：4S支持，C短牌組，19+點"
    "4D" - "Splinter跳叫：4S支持，D短牌組，19+點"
    "4H" - "割裂叫牌：6+H，4S，成局牌力"
    "4S" - "止叫"
}

/**
 * 1H後迫叫性1NT的開叫者再叫
 */
private fun BiddingTree.forcingNoTrumpAfterHeart() {
    "2C" - "4+C或3C（5-3-3-2低限時）" {
        "Pass" - "5+C弱牌"
        "2D" - "5+D，5-9點"
        "2H" - "2張H支持，5-9點"
        "2S" - "邀叫牌力無S止張（代替2NT）"
        "2N" - "邀叫牌力"
        "3C" - "好的6+C，邀叫"
        "3D" - "好的6+D，邀叫"
        "3H" - "延遲性有限加叫：9-12點，3張H"
    }

    "2D" - "4+D" {
        "Pass" - "5+D弱牌"
        "2H" - "2張H支持，5-9點"
        "2N" - "邀叫"
        "3D" - "好的6+D，邀叫"
        "3H" - "延遲性有限加叫"
    }

    "2H" - "6+H，12-15點" {
        "Pass" - "弱牌"
        "2N" - "邀叫"
        "3H" - "邀叫"
        "4H" - "止叫"
    }

    "2S" - "4S，16+點倒叫，迫叫一輪" {
        "2N" - "示弱（5-9點）"
        "3C" - "5+C"
        "3D" - "5+D"
        "3H" - "3張H支持"
    }

    "2N" - "18-19點，迫叫一輪"

    "3C" - "跳叫：5+H-4+C，19+點"
    "3D" - "跳叫：5+H-4+D，19+點"
    "3H" - "6+H，15-19點"

    "4H" - "7+H強牌組"
}

/**
 * 簡單加叫後的開叫者再叫
 */
private fun BiddingTree.simpleRaiseHeart() {
    "Pass" - "低限，不進局試探"
    "2S" - "進局試探：S牌組有些大牌" {
        "3H" - "S牌組弱"
        "4H" - "S牌組好"
    }
    "3C" - "進局試探：C牌組有些大牌"
    "3D" - "進局試探：D牌組有些大牌"
    "3H" - "阻擊性再加叫：6張H"
    "4H" - "進局：19+點或6張H高限"
}

/**
 * 二蓋一應叫後的開叫者再叫
 */
private fun BiddingTree.twoOverOneAfterHeart() {
    "2D" - "4+D（形同倒叫但不需額外牌力）"
    "2H" - "6+H，或5H無其他可叫"
    "2S" - "4S（倒叫但不需額外牌力）"
    "2N" - "13-15點平均牌型，未叫過花色有大牌"
    "3C" - "3+C支持帶大牌，14-15點"
    "3D" - "3+D支持帶大牌，14-15點"
    "3H" - "好的6+H"
    "3N" - "16-18點平均牌型，6張H接近堅實"
    "4C" - "Splinter跳叫：C短牌組"
    "4D" - "Splinter跳叫：D短牌組"
    "4S" - "Splinter跳叫：S短牌組"
}

/**
 * 有限加叫後的開叫者再叫
 */
private fun BiddingTree.limitRaiseHeart() {
    "Pass" - "12-13點平均牌型低限"
    "3S" - "Mathe問叫：問短牌組（3NT表示S短牌組）" {
        "3N" - "S短牌組"
        "4C" - "C短牌組"
        "4D" - "D短牌組"
        "4H" - "無短牌組（半平均牌型）"
    }
    "4H" - "接受邀叫"
}

/**
 * Schreiber迫叫進局跳叫後
 */
private fun BiddingTree.schreiberJumpHeart() {
    "3H" - "問牌（要求說明牌情）" {
        "3S" - "有缺門牌組" {
            "3N" - "問缺門所在" {
                "4C" - "C缺門"
                "4D" - "D缺門"
                "4H" - "S缺門"
            }
        }
        "4C" - "C單張"
        "4D" - "D單張"
        "3N" - "S單張"
    }
    "4H" - "止叫（無滿貫興趣）"
}

/**
 * Splinter跳叫後
 */
private fun BiddingTree.splinterAfterHeart() {
    "4H" - "止叫"
    "4N" - "RKCBlackwood問叫"
    // 扣叫開始滿貫試探
}

/**
 * Swiss加叫後
 */
private fun BiddingTree.swissAfterHeart() {
    "4H" - "止叫"
    "4N" - "RKCBlackwood問叫"
}

/**
 * 支持性賭倍
 */
private fun BiddingTree.supportDouble() {
    "X" - "支持性賭倍：3張應叫花色支持"
    "2H" - "簡單加叫：4+張支持"
    "Pass" - "2張或更少支持"
}
