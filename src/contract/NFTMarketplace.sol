// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct tokenInfo {
        uint256 tokenId;
        address owner;
        string ipfsHash;
        uint256 price;
        bool isListed;
    }

    // mapping(uint256 => uint256) public tokenPrice;
    struct Token {
        uint256 price;
        bool isListed;
    }
    mapping(uint256 => Token) public tokens;

    uint256 public mintingPrice = 0.01 ether;
    address _admin;
    bool public allowCreate;
    bool public allowListing;
    bool public allowBuy;

    constructor() ERC721("MyToken", "MTK") {
        _admin = msg.sender;
        allowCreate = true;
        allowListing = true;
        allowBuy = true;
    }

    event updateContractInstance(string info);

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Only Admin can access this function");
        _;
    }
    modifier doesTokenExist(uint256 tokenId) {
        require(
            ownerOf(tokenId) != address(0),
            "Only Admin can access this function"
        );
        _;
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == _admin;
    }

    function updateMintingPrice(uint256 price) public onlyAdmin {
        mintingPrice = price;
        emit updateContractInstance("Minting price updated");
    }

    function updateCreate(bool create) public onlyAdmin {
        allowCreate = create;
        emit updateContractInstance("NFT creation updated");
    }

    function updateList(bool list) public onlyAdmin {
        allowListing = list;
        emit updateContractInstance("NFT listing updated");
    }

    function updateBuy(bool buy) public onlyAdmin {
        allowBuy = buy;
        emit updateContractInstance("NFT buy updated");
    }

    function createToken(string memory uri) public {
        require(allowCreate, "Token creation has been disabled by the admin");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    //list token to marketplace
    function listToken(uint256 tokenId, uint256 price)
        public
        payable
        doesTokenExist(tokenId)
    {
        require(allowListing, "Token listing has been disabled by the admin");
        require(
            msg.sender == ownerOf(tokenId),
            "Only token owner can list this token"
        );
        require(tokens[tokenId].isListed == false, "Token is already listed");
        require(
            msg.value == mintingPrice,
            "Please send atleast 0.001 ETH for minting"
        );

        tokens[tokenId] = Token(price, true);
    }

    function getAllMyTokens() public view returns (tokenInfo[] memory) {
        uint256 totalToken = balanceOf(msg.sender);
        tokenInfo[] memory token = new tokenInfo[](totalToken);
        for (uint256 index = 0; index < totalToken; index++) {
            uint256 tokenId = tokenOfOwnerByIndex(msg.sender, index);
            address owner = ownerOf(tokenId);
            string memory ipfsHash = tokenURI(tokenId);
            uint256 price = tokens[tokenId].price;
            bool isListed = tokens[tokenId].isListed;
            token[index] = tokenInfo(tokenId, owner, ipfsHash, price, isListed);
        }

        return token;
    }

    function getListedTokensLength() public view returns (uint256) {
        uint256 tokenLength;
        for (
            uint256 index = 0;
            index < _tokenIdCounter.current() + 1;
            index++
        ) {
            uint256 tokenId = index;
            if (tokens[tokenId].isListed == true) {
                tokenLength++;
            }
        }
        return tokenLength;
    }

    function getAllListedTokens() public view returns (tokenInfo[] memory) {
        tokenInfo[] memory listedTokens = new tokenInfo[](
            getListedTokensLength()
        );
        uint256 counter;
        console.log(totalSupply());
        for (uint256 index = 0; index <  _tokenIdCounter.current() + 1; index++) {
            uint256 tokenId = index;
            if (tokens[tokenId].isListed == true) {
                address owner = ownerOf(tokenId);
                string memory ipfsHash = tokenURI(tokenId);
                uint256 price = tokens[tokenId].price;
                bool isListed = tokens[tokenId].isListed;
                listedTokens[counter] = tokenInfo(
                    tokenId,
                    owner,
                    ipfsHash,
                    price,
                    isListed
                );
                counter++;
            }
        }
        return listedTokens;
    }

    function getTokenById(uint256 tokenId)
        public
        view
        doesTokenExist(tokenId)
        returns (tokenInfo memory)
    {
        bool isListed = tokens[tokenId].isListed;
        address owner = ownerOf(tokenId);
        string memory ipfsHash = tokenURI(tokenId);
        uint256 price = tokens[tokenId].price;
        if (!isListed) {
            require(
                msg.sender == owner,
                "Only token owner can access this token"
            );
            return tokenInfo(tokenId, owner, ipfsHash, price, isListed);
        } else {
            return tokenInfo(tokenId, owner, ipfsHash, price, isListed);
        }
    }

    function buyToken(uint256 tokenId) public payable doesTokenExist(tokenId) {
        require(allowBuy, "Token sales has been disabled by the admin");
        require(
            msg.sender != ownerOf(tokenId),
            "You are already owner of this token"
        );

        require(msg.value == tokens[tokenId].price, "Please send actual price");
        require(tokens[tokenId].isListed == true, "Token is not yet listed");

        address owner = ownerOf(tokenId);
        payable(owner).transfer(tokens[tokenId].price);
        _transfer(owner, msg.sender, tokenId);
        tokens[tokenId] = Token(0, false);
    }

    function burnToken(uint256 tokenId) public doesTokenExist(tokenId) {
        require(
            msg.sender == ownerOf(tokenId),
            "Only token owner can burn this token"
        );
        burn(tokenId);
        if (tokens[tokenId].isListed) {
            delete tokens[tokenId];
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
