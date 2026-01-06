package twooverone

import com.github.phisgr.bridge.BiddingTree

/**
 * 2C 強迫叫性開叫
 * 23+ HCP 均衡型或 8+ 贏墩
 */
fun BiddingTree.twoClubStrong() {
    explanation = "強迫叫：23+均衡或8+贏墩"

    // 幾乎所有牌都作2D應叫
    "2D" - "等待性應叫（幾乎所有牌）" {
        // 開叫者再叫
        "2H" - "5+H，迫叫" {
            secondNegativeAfterMajor()
        }
        "2S" - "5+S，迫叫" {
            secondNegativeAfterMajor()
        }
        "2N" - "23-24點均衡型" {
            puppetStayman()
        }
        "3C" - "5+C，迫叫" {
            secondNegativeAfterMinor()
        }
        "3D" - "5+D，迫叫" {
            secondNegativeAfterMinor()
        }
        "3H" - "跳叫：堅實H牌組，問牌開始" {
            askingBidAfterSolidSuit()
        }
        "3S" - "跳叫：堅實S牌組，問牌開始" {
            askingBidAfterSolidSuit()
        }
        "3N" - "25-26點均衡型"
        "4N" - "27+點均衡型"
    }

    // 正應叫：好的5+張牌組帶2頂張
    "2H" - "正應叫：5+H帶AK/AQ/KQ"
    "2S" - "正應叫：5+S帶AK/AQ/KQ"
    "3C" - "正應叫：6+C帶一頂張"
    "3D" - "正應叫：6+D帶一頂張"

    // 無將正應叫
    "2N" - "正應叫：10-12點均衡型，分散大牌"
    "3N" - "正應叫：13+點均衡型"
}

/**
 * 第二輪負應叫（高花牌組再叫後）
 */
private fun BiddingTree.secondNegativeAfterMajor() {
    "3C" - "第二輪負應叫：弱牌" {
        "3H" - "低限（9贏墩），可不叫（如為H牌組）"
        "3S" - "低限，可不叫（如為S牌組）"
        // 其他再叫都是迫叫到局
    }
    "3D" - "4+D支持，有控制"
    "3H" - "3+H支持（如為S牌組再叫後）"
    "4H" - "快速到達：3+H支持，無一輪二輪控制（如為H牌組）"
    "4S" - "快速到達：3+S支持，無一輪二輪控制（如為S牌組）"
}

/**
 * 第二輪負應叫（低花牌組再叫後）
 */
private fun BiddingTree.secondNegativeAfterMinor() {
    "3D" - "第二輪負應叫：弱牌（如3C再叫後）"
    "3H" - "第二輪負應叫：弱牌（如3D再叫後）"
}

/**
 * 堅實牌組跳叫後的問牌
 */
private fun BiddingTree.askingBidAfterSolidSuit() {
    remark(responder, "叫出有A的花色牌組（多個A時叫最經濟的）")
    remark(responder, "無第一輪也無第二輪控制時加叫開叫花色進局")
    remark(responder, "只有第二輪控制時叫3NT")
    remark(opener, "確定將牌後任何新花色都是問叫")
}

/**
 * Puppet Stayman（2NT開叫或2C-2D-2NT後使用）
 */
private fun BiddingTree.puppetStayman() {
    "3C" - "Puppet Stayman：問高花" {
        "3D" - "有一4張高花（不叫該高花）" {
            "3H" - "有4S（讓開叫者叫4S）"
            "3S" - "有4H（讓開叫者叫4H）"
            "4D" - "兩個高花都是4張"
        }
        "3H" - "5張H牌組"
        "3S" - "5張S牌組"
        "3N" - "無4張也無5張高花"
    }
    "3D" - "Jacoby轉移叫：5+H"
    "3H" - "Jacoby轉移叫：5+S"
    "4D" - "Texas轉移叫：6+H"
    "4H" - "Texas轉移叫：6+S"
    "4N" - "定量邀請"
}

/**
 * 2D 開叫 - 三色牌組
 * 4-4-4-1 或 4-4-5-0，10-13 HCP
 */
fun BiddingTree.twoDiamondMulti() {
    explanation = "三色牌組：4-4-4-1或4-4-5-0，10-13點，短牌組為低花"

    "2H" - "示弱叫：0-8點" {
        "Pass" - "H為長牌組"
        "2S" - "S更適合"
    }

    "2S" - "示弱叫：0-8點" {
        "Pass" - "S為長牌組"
        "3H" - "H更適合"
    }

    "2N" - "約定性迫叫：9+點，問牌型" {
        "3C" - "4-4-1-4：C為4張"
        "3D" - "4-4-4-1：D為4張"
        "3H" - "4-4-0-5：C為5張，低限"
        "3S" - "4-4-5-0：D為5張，低限"
        "4C" - "4-4-0-5：C為5張，高限"
        "4D" - "4-4-5-0：D為5張，高限"
    }

    "3C" - "邀叫：10-12點，6+C"
    "3D" - "邀叫：10-12點，6+D"
    "3H" - "邀叫：10-12點，4+H"
    "3S" - "邀叫：10-12點，4+S"

    "3N" - "13-15點，每低花至少4張"

    "4H" - "阻擊或止叫"
    "4S" - "阻擊或止叫"
}

/**
 * 2H 弱二開叫
 * 6張H，5-11 HCP
 */
fun BiddingTree.weakTwoHeart() {
    explanation = "弱二：6張H牌組，5-11點，最多3個控制"

    // 接力問短牌組
    "2S" - "接力叫：問短牌組所在" {
        "2N" - "S短牌組"
        "3C" - "C短牌組"
        "3D" - "D短牌組"
        "3H" - "無短牌組（6-3-2-2）"
    }

    // 接力問牌力/花色牌組品質（類似Ogust）
    "2N" - "接力叫：問牌力和花色牌組品質" {
        "3C" - "7-9點，無2頂張"
        "3D" - "7-9點，有2頂張"
        "3H" - "10-11點，無2頂張"
        "3S" - "10-11點，有2頂張"
        "3N" - "AKQxxx堅實牌組"
    }

    // 自然應叫（限制性）
    "3H" - "防守性加叫（非邀叫）"
    "4H" - "止叫或犧牲"

    "3C" - "新花色：邀請H支持（不配合H）"
    "3D" - "新花色：邀請H支持（不配合H）"
    "3S" - "新花色：邀請H支持（不配合H）"

    "3N" - "止叫（開叫者認為不宜可叫回4H）"

    // 跳叫新花色為問叫（滿貫試探）
    "4C" - "問叫：滿貫試探"
    "4D" - "問叫：滿貫試探"
    "4S" - "問叫：滿貫試探"
}

/**
 * 2S 弱二開叫
 * 6張S，5-11 HCP
 */
fun BiddingTree.weakTwoSpade() {
    explanation = "弱二：6張S牌組，5-11點，最多3個控制"

    // 接力問短牌組
    "2N" - "接力叫：問短牌組所在" {
        "3C" - "C短牌組"
        "3D" - "D短牌組"
        "3H" - "H短牌組"
        "3S" - "無短牌組（6-3-2-2）"
    }

    // 接力問牌力/花色牌組品質
    "3C" - "接力叫：問牌力和花色牌組品質" {
        "3D" - "7-9點，無2頂張"
        "3H" - "7-9點，有2頂張"
        "3S" - "10-11點，無2頂張"
        "3N" - "10-11點，有2頂張或AKQxxx堅實牌組"
    }

    // 自然應叫
    "3S" - "防守性加叫"
    "4S" - "止叫或犧牲"

    "3D" - "新花色：邀請S支持"
    "3H" - "新花色：邀請S支持"

    "3N" - "止叫"

    // 問叫
    "4C" - "問叫：滿貫試探"
    "4D" - "問叫：滿貫試探"
    "4H" - "問叫：滿貫試探"
}

/**
 * 2NT 開叫
 * 21-22 HCP 均衡型
 */
fun BiddingTree.twoNoTrump() {
    explanation = "21-22點均衡型（20點有5張牌組可增值）"

    // Puppet Stayman
    "3C" - "Puppet Stayman：問高花" {
        "3D" - "有一4張高花" {
            "3H" - "有4S"
            "3S" - "有4H"
            "4D" - "兩個高花都4張"
        }
        "3H" - "5張H"
        "3S" - "5張S"
        "3N" - "無4張以上高花"
    }

    // Jacoby轉移叫
    "3D" - "Jacoby轉移叫：5+H" {
        "3H" - "接受轉移"
    }
    "3H" - "Jacoby轉移叫：5+S" {
        "3S" - "接受轉移"
    }

    // Minor Suit Stayman和Walsh接力叫仍使用
    "3S" - "Minor Suit Stayman"

    // Texas轉移叫
    "4D" - "Texas轉移叫：6+H" {
        "4H" - "接受轉移"
    }
    "4H" - "Texas轉移叫：6+S" {
        "4S" - "接受轉移"
    }

    "4N" - "滿貫定量邀請"
    "3N" - "止叫"
}

/**
 * 三副開叫（阻擊）
 */
fun BiddingTree.threeLevel() {
    explanation = "阻擊開叫：7張牌組（低花可6張），5-7贏墩，最多1.5防守贏張"

    "3N" - "止叫"
    "4M" - "止叫（高花開叫時）"
    "5m" - "止叫（低花開叫時）"

    // 新花色跳叫為問叫
    remark(responder, "新花色跳叫為問叫")
}

/**
 * 3NT 開叫 - 賭博性低花
 * 8張不連張低花牌組
 */
fun BiddingTree.threeNoTrump() {
    explanation = "賭博性3NT：8張不連張低花牌組"

    "Pass" - "有止張和低花相配大牌"

    "4C" - "選擇定約：C就不叫，D就改叫4D" {
        "Pass" - "C牌組"
        "4D" - "D牌組"
    }

    "4D" - "選擇定約：D就不叫，C就改叫5C" {
        "Pass" - "D牌組"
        "5C" - "C牌組"
    }

    "4H" - "問叫"
    "4S" - "問叫"

    "4N" - "問花色和品質" {
        "5C" - "C牌組，無A無K"
        "5D" - "D牌組，無A無K"
        "5H" - "C牌組，有A或K"
        "5S" - "D牌組，有A或K"
        "5N" - "有AK"
        "6C" - "C牌組，有AQ或KQ"
        "6D" - "D牌組，有AQ或KQ"
    }

    "5C" - "選擇止叫（任一低花成局）" {
        "Pass" - "C牌組"
        "5D" - "D牌組"
    }

    "5D" - "選擇止叫（C滿貫或D成局）" {
        "Pass" - "D牌組"
        "6C" - "C牌組"
    }

    "6C" - "選擇滿貫" {
        "Pass" - "C牌組"
        "6D" - "D牌組"
    }
}

/**
 * Namyats 4C 開叫
 * 好的H牌組，8贏墩
 */
fun BiddingTree.namyatsHeart() {
    explanation = "Namyats：好的H牌組（缺K或Q但不缺A），8-8.5贏墩"

    "4D" - "示弱接力：轉回給開叫者打" {
        "4H" - "開叫者成為定約者"
    }

    "4H" - "示弱：保護間張大牌，應叫者成為定約者"

    // 超過轉移花色水平的新花色為問叫
    "4S" - "問叫：S控制情況"
    "5C" - "問叫：C控制情況"
    "5D" - "問叫：D控制情況"
}

/**
 * Namyats 4D 開叫
 * 好的S牌組，8贏墩
 */
fun BiddingTree.namyatsSpade() {
    explanation = "Namyats：好的S牌組（缺K或Q但不缺A），8-8.5贏墩"

    "4H" - "示弱接力：轉回給開叫者打" {
        "4S" - "開叫者成為定約者"
    }

    "4S" - "示弱：保護間張大牌，應叫者成為定約者"

    // 問叫
    "4N" - "問叫"
    "5C" - "問叫：C控制情況"
    "5D" - "問叫：D控制情況"
    "5H" - "問叫：H控制情況"
}
