"use client"

import Image from "next/image";
import "@/styles/article/articleIndex.css";
import SideBar from "./_components/sideBar";
import ArticleCard from "./_components/articleCard";
import Pagination from "./_components/pagination";

export default function ArticlePage() {
    return (
        <div className="container-fluid">
           
            <div className="begin">
                <div className="background"></div>
                    <div className="hot-article">
                        <div className="hot1">
                            <h5>居家生活</h5>
                            <h2>從設計到情感：家具如何塑造我們的生活空間與內在世界</h2>
                            <p>
                                在現代人快節奏的生活裡，家具往往被視為一種「功能性配件」——我們用它來吃飯、睡覺、工作、休息。然而，真正了解家具的人都知道，它不只是生活的工具，更是空間的靈魂，是情感的投射，也是文化與品味的延伸。
                            </p>
                            <button className="readMoreButton">Read more</button>
                        </div>
                        <div className="hot2">
                            <h4>從設計到情感：家具如何塑造我們的生活空間與內在世界</h4>
                            <div className="readMore">Read more</div>
                            <div className="arrow">箭頭</div>
                        </div>
                        <div className="hot3">
                            <h4>從設計到情感：家具如何塑造我們的生活空間與內在世界</h4>
                            <div className="readMoreArrow">
                                <div className="readMore">Read more</div>
                                <div className="arrow">箭頭</div>
                            </div>
                        </div>

                    </div>
            </div>
            <div className="main">
                <div className="main-list">
                    {/* sidebar---------- */}
                    <SideBar/>
                    <div className="main-article">
                        <div className="main-article-list">
                            {/* 卡片區------- */}
                           <ArticleCard/>
                        </div>
                        {/* 分頁區------- */}
                     <Pagination/>
                    </div>
                </div>
            </div>
            <div>footer</div>
        </div>
    );
}