"use client"

import Image from "next/image";
import "@/styles/article/articleIndex.css";

export default function ArticleCard() {
    return (
        <div className="article-row card">
            <Image src="/img/living-room.jpg" alt="name" width={264} height={173}/>
            <h5>如何挑選一張理想的沙發？設計、材質與舒適度全面解析</h5>
            <h6 lang="en">2025.07.24</h6>
            <div className="card-category">
                <h6>#家居設計</h6>
            </div>
        </div>
    );
}